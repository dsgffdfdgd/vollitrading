import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
    try {
        const response = await fetch("https://nfs.faireconomy.media/ff_calendar_thisweek.xml");
        const xmlText = await response.text();

        const parser = new XMLParser();
        const jObj = parser.parse(xmlText);

        const events = jObj.weeklyevents.event;

        // Ensure events is an array (it might be a single object if only one event)
        const eventArray = Array.isArray(events) ? events : [events];

        // Filter for High Impact events and valid currency
        const highImpactEvents = eventArray.filter((e: any) =>
            e.impact === "High" &&
            ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"].includes(e.country)
        );

        // Sort by date/time (closest to now)
        // Helper to parse FF date string (MM-DD-YYYY) and time (1:30pm)
        const parseFFDate = (dateStr: string, timeStr: string) => {
            // Handle "All Day" or missing time
            if (!timeStr || timeStr.toLowerCase().includes('day')) {
                const [m, d, y] = dateStr.split('-');
                return new Date(Number(y), Number(m) - 1, Number(d), 23, 59, 0); // End of day
            }

            const [m, d, y] = dateStr.split('-');

            // Time parsing (e.g., "1:30pm")
            const match = timeStr.match(/(\d+):(\d+)([ap]m)/i);
            if (!match) return new Date(); // Fallback

            let [_, valH, valM, meridiem] = match;
            let hours = Number(valH);
            const minutes = Number(valM);

            if (meridiem.toLowerCase() === 'pm' && hours < 12) hours += 12;
            if (meridiem.toLowerCase() === 'am' && hours === 12) hours = 0;

            // Note: FF times in the XML are often loosely East Coast US. 
            // For simplicity, we create a date object. Ideal would be strictly handling timezones 
            // but relative sorting is usually enough for "upcoming".
            return new Date(Number(y), Number(m) - 1, Number(d), hours, minutes);
        };

        const now = new Date();

        // 1. Map to objects with parsed Date
        const mappedEvents = highImpactEvents.map((e: any) => {
            const eventDate = parseFFDate(e.date, e.time);
            return {
                raw: e,
                timestamp: eventDate.getTime(),
                formattedDate: eventDate
            };
        });

        // 2. Filter for future events only (or very recent past like last 1 hour)
        //    Buffer of 1 hour (3600000 ms) to keep "just released" news for a bit.
        const futureEvents = mappedEvents.filter(e => e.timestamp > (now.getTime() - 3600000));

        // 3. Sort by time ascending (closest first)
        futureEvents.sort((a, b) => a.timestamp - b.timestamp);

        // 4. Transform back to simple response format & Slice top 5
        const upcomingEvents = futureEvents
            .slice(0, 5)
            .map(item => ({
                title: item.raw.title,
                country: item.raw.country,
                date: item.raw.date,
                time: item.raw.time,
                impact: item.raw.impact,
                forecast: item.raw.forecast || "",
                previous: item.raw.previous || ""
            }));

        return NextResponse.json(upcomingEvents);

    } catch (error) {
        console.error("Forex Factory Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
    }
}
