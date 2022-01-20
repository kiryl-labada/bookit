import React from 'react';
import { MainPage } from './pages/MainPage';
import { Route } from 'react-router-dom'
import { useDbView } from '@epam/uui-db';
import { AppHeader } from './AppHeader'
import css from './App.module.scss';

export const App = () => {
    useDbView((db) => db, {});

    return (
        <div className={ css.app }>
            <Route component={ AppHeader } />
            <main>
                <Route path="/" exact component={MainPage} />
            </main>
            <footer></footer>
        </div>
    );
}
