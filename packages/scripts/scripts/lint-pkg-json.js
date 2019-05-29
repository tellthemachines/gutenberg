/**
 * External dependencies
 */
const minimist = require( 'minimist' );
const { sync: spawn } = require( 'cross-spawn' );
const { sync: resolveBin } = require( 'resolve-bin' );

/**
 * Internal dependencies
 */
const {
	fromConfigRoot,
	getCliArgs,
	hasCliArg,
	hasProjectFile,
	hasPackageProp,
} = require( '../utils' );

const args = getCliArgs();

const hasFiles = minimist( args )._.length > 0;
const defaultFilesArgs = ! hasFiles ? [ '.' ] : [];

const hasLintConfig = hasCliArg( '-c' ) ||
	hasCliArg( '--configFile' ) ||
	hasProjectFile( '.npmpackagejsonlintrc.json' ) ||
	hasProjectFile( 'npmpackagejsonlint.config.js' ) ||
	hasPackageProp( 'npmPackageJsonLintConfig' );

const defaultConfigArgs = ! hasLintConfig ?
	[ '--configFile', fromConfigRoot( 'npmpackagejsonlint.json' ) ] :
	[];

const result = spawn(
	resolveBin( 'npm-package-json-lint', { executable: 'npmPkgJsonLint' } ),
	[ ...defaultConfigArgs, ...args, defaultFilesArgs ],
	{ stdio: 'inherit' }
);

process.exit( result.status );
