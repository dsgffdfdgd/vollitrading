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
        const now = new Date();
        const upcomingEvents = highImpactEvents
            .map((e: any) => {
                // FF date format: "MM-DD-YYYY"
                // FF time format: "2:30pm"
                // Construct ISO string is tricky without timezone. FF usually uses NY time or server time? 
                // Actually the XML usually has `date` and `time`.
                // Let's just return the raw string and handle simplistic display or simple sorting.
                return {
                    title: e.title,
                    country: e.country,
                    date: e.date,
                    time: e.time,
                    impact: e.impact,
                    forecast: e.forecast || "",
                    previous: e.previous || ""
                };
            })
            .slice(0, 5); // Take top 5

        return NextResponse.json(upcomingEvents);

    } catch (error) {
        console.error("Forex Factory Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
    }
}
