import React from 'react';
import { MainPage } from './pages/MainPage';
import { Route } from 'react-router-dom'
import { useDbView } from '@epam/uui-db';
import { AppHeader } from './AppHeader'
import css from './App.module.scss';
import { CatalogPage } from 'pages/catalog/Catalog';
import { BookingPage } from 'pages/booking/Booking';

export const App = () => {
    useDbView((db) => db, {});

    return (
        <div className={ css.app }>
            <Route component={ AppHeader } />
            <main style={ { position: 'relative' } }>
                <Route path="/" exact component={MainPage} />
                <Route path="/booking" exact component={BookingPage} />
                <Route path="/catalog" exact component={CatalogPage} />
            </main>
            {/* <footer></footer> */}
        </div>
    );
}
