import { Button } from '@blueprintjs/core'
import axios from 'axios'
import { NLU } from 'botpress/sdk'
import { lang, ToolTip } from 'botpress/shared'
import cx from 'classnames'
import _ from 'lodash'
import React, { FC, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { RootReducer } from '~/reducers'

import style from './style.scss'

interface Props {
  trainSession: NLU.TrainingSession
}

// TODO change this url for core ?
const BASE_NLU_URL = `${window.BOT_API_PATH}/mod/nlu`

const TrainingStatusComponent: FC<Props> = (props: Props) => {
  const { status, progress } = props.trainSession ?? {}

  const [message, setMessage] = useState('')

  const onTrainingNeeded = () => setMessage('')
  const onTraingDone = () => setMessage(lang.tr('statusBar.ready'))
  const onCanceling = () => setMessage(lang.tr('statusBar.canceling'))
  const onError = () => setMessage(lang.tr('statusBar.trainingError'))
  const onTrainingProgress = (progress: number) => {
    const p = Math.floor(progress * 100)
    setMessage(`${lang.tr('statusBar.training')} ${p}%`)
  }

  useEffect(() => {
    if (status === 'training') {
      onTrainingProgress(progress ?? 0)
    } else if (status === 'errored') {
      onError()
    } else if (status === 'canceled') {
      onCanceling()
    } else if (status === 'needs-training') {
      onTrainingNeeded()
    } else if (status === 'idle' || status === 'done') {
      onTraingDone()
    }
  }, [props.trainSession])

  const onTrainClicked = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await axios.post(`${BASE_NLU_URL}/train`)
    } catch (err) {
      onError()
    }
  }

  const onCancelClicked = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    onCanceling()
    try {
      await axios.post(`${BASE_NLU_URL}/train/delete`)
    } catch (err) {
      console.log('cannot cancel training')
    }
  }

  if (status === null) {
    return null
  } else {
    return (
      <div className={style.item}>
        <span className={style.message}>{message}</span>

        {/*
            Button is displayed even when training is being cancelled because
            1. Sometimes training seems stuck and cancel is uneffective
            2. Training Cancelation is currently a long and unreliable process
            */}
        {['needs-training', 'canceled'].includes(status) && (
          <ToolTip content={lang.tr('statusBar.trainChatbotTooltip')}>
            <Button minimal className={style.button} onClick={onTrainClicked}>
              {lang.tr('statusBar.trainChatbot')}
            </Button>
          </ToolTip>
        )}
        {status === 'training' && (
          <Button minimal className={cx(style.button, style.danger)} onClick={onCancelClicked}>
            {lang.tr('statusBar.cancelTraining')}
          </Button>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state: RootReducer) => ({
  trainSession: state.nlu.trainSession
})
export default connect(mapStateToProps)(TrainingStatusComponent)