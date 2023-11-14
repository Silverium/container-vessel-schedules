#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
// import meow from 'meow';
import App from './app.js';

/* const cli = meow(
	`
	Usage
	  $ container-vessel-schedules

	Options
		--name  Your name

	Examples
	  $ container-vessel-schedules --name=Jane
	  Hello, Jane
`,
	{
		importMeta: import.meta,
		flags: {
			name: {
				type: 'string',
			},
		},
	},
); */

render(<App /* name={cli.flags.name} */ />);
