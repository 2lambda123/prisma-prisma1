import * as React from 'react'
import { Prompt } from '../../prompt-lib/BoxPrompt'
import { PromptState } from '../InteractivePrompt'
import { ActionType } from '../reducer'
import { Steps, stepsToElements } from '../steps-definition'

export function renderSelectTool(dispatch: React.Dispatch<ActionType>, state: PromptState) {
  return (
    <Prompt
      key={Steps.SELECT_TOOL}
      title="Which parts of Prisma do you want to use?"
      subtitle="Learn more about the tools at prisma.io/docs"
      elements={stepsToElements[Steps.SELECT_TOOL]()}
      formValues={state}
      withBackButton={{
        label: 'Back',
        description: '(Select schema)',
      }}
      onFormChanged={params => {
        dispatch({
          type: 'set_tools',
          payload: {
            lift: params.values.lift === undefined ? false : params.values.lift,
            photon: params.values.photon === undefined ? false : params.values.photon,
          },
        })
      }}
      onSubmit={params => {
        if (params.goBack) {
          return dispatch({ type: 'back' })
        }
        if (params.selectedValue === '__CREATE__' && (state.lift || state.photon)) {
          dispatch({ type: 'set_step', payload: { step: Steps.SELECT_LANGUAGE } })
        } else {
          params.stopSpinner({ state: 'failed', message: 'Please, select at list one tool' })
        }
      }}
    />
  )
}
