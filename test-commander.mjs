import { Command } from '@commander-js/extra-typings';
const cmd = new Command();
cmd.name('test').version('1.0.0').parse(process.argv);
