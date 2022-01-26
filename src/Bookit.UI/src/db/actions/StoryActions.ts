import { getTempId } from '@epam/uui-db';
import { Story } from '../models';
import { Action } from './common';


const updateStory: Action<Partial<Story>> = (patch) => (db) => ({ stories: [patch] });

const createStory: Action<Partial<Story>> = (s) => (db) => {
    const id = s.id || getTempId();
    const item = {
        id,
        name: s.name
    };

    return { stories: [item] };
};

export const storyActions = {
    updateStory,
    createStory,
};
