import { IAgentContext, IPluginMethodMap } from './IAgent.js'
import { IVerifyResult } from './IVerifyResult.js'
import { W3CVerifiableCredential } from './vc-data-model.js'
import { IResolver } from './IResolver.js'
import { IDIDManager } from './IDIDManager.js'

/**
 * Encapsulates the parameters required to verify a
 * {@link https://www.w3.org/TR/vc-data-model/#credentials | W3C Verifiable Credential}
 *
 * @public
 */
export interface IVerifyCredentialArgs {
  /**
   * The Verifiable Credential object according to the
   * {@link https://www.w3.org/TR/vc-data-model/#credentials | canonical model} or the JWT representation.
   *
   * The signer of the Credential is verified based on the `issuer.id` property
   * of the `credential` or the `iss` property of the JWT payload respectively
   *
   */
  credential: W3CVerifiableCredential

  /**
   * When dealing with JSON-LD you also MUST provide the proper contexts.
   * Set this to `true` ONLY if you want the `@context` URLs to be fetched in case they are not preloaded.
   * The context definitions SHOULD rather be provided at startup instead of being fetched.
   *
   * Defaults to `false`
   */
  fetchRemoteContexts?: boolean

  /**
   * Overrides specific aspects of credential verification, where possible.
   */
  policies?: VerificationPolicies

  /**
   * Other options can be specified for verification.
   * They will be forwarded to the lower level modules. that perform the checks
   */
  [x: string]: any
}

/**
 * These optional settings can be used to override some default checks that are performed on Presentations during
 * verification.
 *
 * @beta
 */
export interface VerificationPolicies {
  /**
   * policy to over the now (current time) during the verification check (UNIX time in seconds)
   */
  now?: number

  /**
   * policy to skip the issuanceDate (nbf) timestamp check when set to `false`
   */
  issuanceDate?: boolean

  /**
   * policy to skip the expirationDate (exp) timestamp check when set to `false`
   */
  expirationDate?: boolean

  /**
   * policy to skip the audience check when set to `false`
   */
  audience?: boolean

  /**
   * policy to skip the revocation check (credentialStatus) when set to `false`
   */
  credentialStatus?: boolean

  /**
   * Other options can be specified for verification.
   * They will be forwarded to the lower level modules that perform the checks
   */
  [x: string]: any
}

/**
 * The interface definition for a plugin that can generate Verifiable Credentials and Presentations
 *
 * @see {@link @veramo/credential-w3c#CredentialPlugin} for an implementation.
 * @remarks Please see {@link https://www.w3.org/TR/vc-data-model | W3C Verifiable Credentials data model}
 *
 * @public
 */
export interface ICredentialVerifierBase extends IPluginMethodMap {
  /**
   * Verifies a Verifiable Credential JWT, LDS Format or EIP712.
   *
   * @param args - Arguments necessary to verify a VerifiableCredential
   * @param context - This reserved param is automatically added and handled by the framework, *do not override*
   *
   * @returns - a promise that resolves to an object containing a `verified` boolean property and an optional `error`
   *   for details
   *
   * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#credentials | Verifiable Credential data model}
   */
  verifyCredential(args: IVerifyCredentialArgs, context: VerifierAgentContext): Promise<IVerifyResult>
}

/**
 * Represents the requirements that this plugin has.
 * The agent that is using this plugin is expected to provide these methods.
 *
 * This interface can be used for static type checks, to make sure your application is properly initialized.
 *
 * @beta
 */
export type VerifierAgentContext = IAgentContext<
  IResolver & Pick<IDIDManager, 'didManagerGet' | 'didManagerFind'>
>