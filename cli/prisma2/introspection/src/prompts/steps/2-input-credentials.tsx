import * as React from 'react'
import { credentialsToUri, uriToCredentials } from '../../convertCredentials'
import { getConnectedConnectorFromCredentials, getDatabaseSchemasWithMetadata } from '../../introspect/util'
import { onFormChangedParams, OnSubmitParams, Prompt } from '../../prompt-lib/BoxPrompt'
import { DatabaseCredentials } from '../../types'
import { dbTypeTodbName, defaultCredentials, PromptState } from '../CredentialPrompt'
import { ActionType } from '../reducer'
import { Steps, stepsToElements } from '../steps-definition'

export function renderInputDatabaseCredentials(dispatch: React.Dispatch<ActionType>, state: PromptState) {
  return (
    <Prompt
      key={Steps.INPUT_DATABASE_CREDENTIALS}
      elements={stepsToElements[Steps.INPUT_DATABASE_CREDENTIALS](state.credentials.type!)}
      title={`Enter ${dbTypeTodbName[state.credentials.type!]} credentials`}
      subtitle={`Learn how to set up a ${dbTypeTodbName[state.credentials.type!]} database: prisma.io/docs`}
      formValues={state.credentials}
      onFormChanged={onDatabaseCredentialsChanged(dispatch)}
      onSubmit={onConnectOrTest(state, dispatch)}
      withBackButton={{
        label: 'Back',
        description: '(Database selection)',
      }}
    />
  )
}

function onDatabaseCredentialsChanged(
  dispatch: React.Dispatch<ActionType>,
): ((params: onFormChangedParams) => void) | undefined {
  return ({ values, triggeredInput }) => {
    let credentials: DatabaseCredentials = {
      ...(values as DatabaseCredentials),
    }
    if (triggeredInput.identifier === 'uri') {
      try {
        credentials = uriToCredentials(values['uri'])
      } catch {}
    } else {
      credentials['uri'] = credentialsToUri({
        ...defaultCredentials(credentials['type']),
        ...credentials,
      } as DatabaseCredentials)
    }
    dispatch({ type: 'set_credentials', payload: { credentials } })
  }
}

function onConnectOrTest(state: PromptState, dispatch: React.Dispatch<ActionType>): (params: OnSubmitParams) => void {
  return async params => {
    const newCredentials = {
      ...state.credentials,
      ...params.formValues,
    } as DatabaseCredentials

    if (params.goBack) {
      return dispatch({
        type: 'back',
        payload: {
          credentials: newCredentials,
        },
      })
    }

    if (params.selectedValue === '__CONNECT__') {
      await onConnect(params, newCredentials, dispatch)
    }
  }
}

async function onConnect(
  params: OnSubmitParams,
  credentials: DatabaseCredentials,
  dispatch: React.Dispatch<ActionType>,
) {
  params.startSpinner()

  try {
    const connectorAndDisconnect = await getConnectedConnectorFromCredentials(credentials)
    const schemas = await getDatabaseSchemasWithMetadata(connectorAndDisconnect.connector)

    params.stopSpinner({ state: 'succeeded' })

    if (schemas) {
      dispatch({
        type: 'connect_db',
        payload: {
          schemas,
          connectorAndDisconnect,
          credentials,
        },
      })
    }
  } catch (e) {
    params.stopSpinner({ state: 'failed', message: e.message })
  }
}
