import { fetchAllTemplates, fetchLatestTemplates, fetchPopularTemplates, fetchSearchResults, fetchHomeTags } from "../services/home.services.js";

export const getSearchResults = async (req, res, next) => {
    try {
        const query = req.query.q?.toString() || '';
        if (!query.trim()) return res.json([]);
        const results = await fetchSearchResults(query);
        res.json(results);
    } catch (error) {
        next (error)
    }
}

export const getHomeTemplates = async (req, res, next) => {
    try {
        res.json(await Promise.all([
            fetchLatestTemplates(),
            fetchPopularTemplates(),
            fetchAllTemplates(),
            fetchHomeTags(),
        ]));
    } catch (error) {
        next (error)
    }
}