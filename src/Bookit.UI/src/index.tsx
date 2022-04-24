import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';

import '@epam/uui-components/styles.css';
import '@epam/loveship/styles.css';
import '@epam/promo/styles.css';

import { createBrowserHistory } from 'history';
import { ContextProvider } from '@epam/uui';
import { Snackbar, Modals } from '@epam/uui-components';
import { DbContext } from '@epam/uui-db';
import { ErrorHandler } from '@epam/loveship';
import { App } from './App';
import { svc } from './services';
import { BookingDbRef, getApi } from './db';

const history = createBrowserHistory();
const dbRef = new BookingDbRef();
Object.assign(window, { dbRef });

const UuiEnhancedApp = () => (
    <ContextProvider
        apiDefinition={ getApi }
        onInitCompleted={(context) => {
            Object.assign(svc, context);
            Object.assign(svc, { idMap: dbRef.idMap });
        }}
        history={ history }
    >
        <ErrorHandler>
            <App />
            <Snackbar />
            <Modals />
        </ErrorHandler>
    </ContextProvider>
);

const RoutedApp = () => (
    <Router history={ history }>
        <DbContext.Provider value={ dbRef }>
            <UuiEnhancedApp />
        </DbContext.Provider>
    </Router>
)


ReactDOM.render(<RoutedApp />, document.getElementById('root'));