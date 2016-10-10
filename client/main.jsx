import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import App from '../import/ui/App.jsx';
//import '../import/startup/accounts-config.js';

Meteor.startup(() => {
    render(<App />, document.getElementById('render-target'));
});