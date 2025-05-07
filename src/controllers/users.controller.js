import axios from "axios";
import { User } from "../models/User.js";
import { findAll, findOneById } from "../utils/utils.js";
import config from "../config/env.js";

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

        const payload = {
        allOrNone: true,
        compositeRequest: [
            {
                method: 'POST',
                url: '/services/data/v63.0/sobjects/Account',
                referenceId: 'NewAccount',
                body: {
                    Name: name,
                    Description: 'Account created from form submission',
                },
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
        };

        const result = await axios.post(
            `${config.sfInstanceUrl}/services/data/v63.0/composite`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${config.sfAccessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

    res.status(200).json(result.data);
    } catch (error) {
        next(error)
    }
}