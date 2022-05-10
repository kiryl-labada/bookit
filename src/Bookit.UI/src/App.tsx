import React from 'react';
import { MainPage } from './pages/MainPage';
import { Route } from 'react-router-dom'
import { useDbView } from '@epam/uui-db';
import { AppHeader } from './AppHeader'
import css from './App.module.scss';
import { CatalogPage } from './pages/catalog/Catalog';
import { BookingPage } from './pages/booking/Booking';
import { SettingsPage } from './pages/settings/SettingsPage';

export const App = () => {
    useDbView((db) => db, {});

    return (
        <div className={ css.app }>
            <Route component={ AppHeader } />
            <main /*style={ { position: 'relative' } }*/>
                <Route path="/" exact component={MainPage} />
                <Route path="/booking" component={BookingPage} />
                <Route path="/catalog" component={CatalogPage} />
                <Route path="/settings" exact component={SettingsPage} />
            </main>
            {/* <footer></footer> */}
        </div>
    );
}
