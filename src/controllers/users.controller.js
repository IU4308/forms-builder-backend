import { User } from "../models/User.js";
import { findAll, findOneById, generateApiToken, groupResults } from "../utils/utils.js";
import { Connection } from 'jsforce';
import config from "../config/env.js";
import { fetchAggregatedResults } from "../services/users.services.js";
import { Dropbox } from 'dropbox'
import fetch from 'node-fetch'

export const getUsers = async (req, res, next) => {
    try {
        res.json(await findAll(User));
    } catch (error) {
        next(error)
    }
}

export const getUserById = async (req, res, next) => {
    const { userId } = req.params
    try {
        res.json(await findOneById(User, userId))
    } catch (error) {
        next(error)
    }
}

export const createSalesforseAccount = async (req, res, next) => {
    const { name, email, phone, leadSource, consent } = req.body;
    try {
        const conn = new Connection({
            loginUrl: config.SF_LOGIN_URL
        });

        await conn.login(config.SF_USERNAME, config.SF_PASSWORD);

        const result = await conn.requestPost('/services/data/v63.0/composite', {
            allOrNone: true,
            compositeRequest: [
                {
                    method: 'POST',
                    url: '/services/data/v63.0/sobjects/Account',
                    referenceId: 'NewAccount',
                    body: { Name: name, Description: 'Created via form' },
                },
                {
                    method: 'POST',
                    url: '/services/data/v63.0/sobjects/Contact',
                    referenceId: 'NewContact',
                    body: {
                    LastName: name,
                    Email: email,
                    Phone: phone,
                    LeadSource: leadSource,
                    Wants_Newsletters__c: consent === 'on',
                    AccountId: '@{NewAccount.id}',
                    },
                },
            ],
        });
      
        res.json({ message: 'Saved successfully', result });
    } catch (error) {
        next(error)
    }
}

export const getToken = (req, res, next) => {
    const { userId } = req.params
    try {
        res.json(generateApiToken(`${config.BASE_URL}/api/users/${userId}/export`))
    } catch (error) {
        next (error)
    }
}

export const exportTemplates = async (req, res, next) => {
    const { userId } = req.params
    try {
        const results = await fetchAggregatedResults(userId)
        res.json(groupResults(results.rows))
    } catch(error) {
        next(error)
    }
}

export const uploadReport = async (req, res, next) => {
    try {
        const jsonData = JSON.stringify(req.body);
        const fileName = `/reports/report-${Date.now()}.json`;

        const dbx = new Dropbox({
            clientId: config.DROPBOX_CLIENT_ID,
            clientSecret: config.DROPBOX_CLIENT_SECRET,
            refreshToken: config.DROPBOX_REFRESH_TOKEN,
            fetch,
        });

        const response = await dbx.filesUpload({
            path: fileName,
            contents: jsonData,
            mode: 'add', 
            autorename: true,
            mute: true,
        })

        res.status(200).json({ result: response.result, message: 'The report has been sent.' });
    } catch(error) {
        next(error)
    }
}