import { api } from "@/utils/axios";

export async function getRelevantContent(query: string): Promise<any[]> {
    // try {
    //     const response = await api.get("/paises/1")
    //     const data = JSON.stringify(response.data);
    //     const stringData = [data];
    //     return stringData;
    // } catch (error) {
    //     console.error("Error:", error);
    //     return []
    // }
    return [
        JSON.stringify({
            state: "Kansas",
            slug: "kansas",
            code: "KS",
            nickname: "Sunflower State",
            website: "https://www.kansas.gov",
            admission_date: "1861-01-29",
            admission_number: 34,
            capital_city: "Topeka",
            capital_url: "http://www.topeka.org",
            population: 2893957,
            population_rank: 34,
            constitution_url: "https://kslib.info/405/Kansas-Constitution",
            twitter_url: "http://www.twitter.com/ksgovernment",
        })
    ];
}
