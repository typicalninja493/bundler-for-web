import { version as webPackVersion } from 'webpack'
import { normalizePackageName } from './normalize';


export const PROCESS_EVENTS = {
	ready: 'READY',
	log: 'LOG',
	bundle: 'BUNDLE',
	fail: 'FAIL'
}

export const version = '1.0.0'
export const name = 'bundler-for-web';

export type httpError = {
	error: boolean,
	message: string,
	data: string[]
}
/**
 * General httpResponse Type from bundlers must follow this type
 */
export type httpResponse = {
	result?: string | null,
	error?: httpError | null,
	headers?: {  }
}

// construct a fail script as a global function that will call itself or a function in the variable of the pkgName to error
export const Insert_SubStituteFailScript = ({ reason = 'Unknown', pkg = '<Not Found>' } = {}) => {

const mainScript = `(() => {
		// throw our error
		console.error('[${name}] Running Server Version: ${version}')
		console.error('[${name}] A Error Occurred While Requiring/Bundling ${pkg.replace('\'', '"')}')
		throw new Error('[${name}]: ${reason.replace('\'', '"')}')
})`

return `
/**
	* Script Loading Failed:
	* Reason: ${reason}
	* Server version: ${version}
	* WebPackVersion: ${webPackVersion}
	* This Script Was Generated Automatically on ${new Date().toDateString()}, after bundling encountered a Error
*/

	${pkg == '<Not Found>' ? mainScript + '()' : `${normalizePackageName(pkg.split('@')[0])}=${mainScript}`}
`
}

export const Insert_ScriptServerComments = (script: string, cache: boolean, minified: boolean) => {
if(minified) return script;
	return `
/** 
* Generated With ${name}
* on ${new Date().toDateString()}
* cached script: ${cache}

* Server version: ${version}
* WebPackVersion: ${webPackVersion}
* size: ${script.length}
*/
${script}
	`
}
