/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { isStatus, OrchestratorType } from '@showwhy/api-client'
import { buildSignificanceTestsNode } from '@showwhy/builders'
import type {
	AlternativeModels,
	Estimator,
	Experiment,
	Handler,
	Maybe,
	RefutationOption,
	SignificanceTest,
} from '@showwhy/types'
import { NodeResponseStatus } from '@showwhy/types'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
	useActualSignificanceTest,
	useAlternativeModels,
	useAutomaticWorkflowStatus,
	useCausalEffects,
	useDefaultRun,
	useRefutationOptions,
	useRunSignificanceTest,
	useSpecificationCurve,
} from '~hooks'
import {
	useDefaultDatasetResult,
	useEstimators,
	useExperiment,
	usePrimarySpecificationConfig,
	useSpecificationCurveConfig,
} from '~state'
import type { DefaultDatasetResult, RunHistory, Specification } from '~types'

import { useLoadSpecificationData } from '../EstimateCausalEffectsPage/EstimateCausalEffectPage.hooks'

export function useBusinessLogic(): {
	alternativeModels: AlternativeModels
	defaultRun: Maybe<RunHistory>
	causalEffects: ReturnType<typeof useCausalEffects>
	specificationData: Specification[]
	defaultDataset: DefaultDatasetResult | null
	defineQuestion: Experiment
	activeValues: number[]
	significanceTestResult: Maybe<SignificanceTest>
	significanceFailed: boolean
	isCanceled: boolean
	runSignificance: Handler
	cancelRun: Handler
	refutationOptions: RefutationOption[]
	estimators: Estimator[]
} {
	const defineQuestion = useExperiment()
	const primarySpecificationConfig = usePrimarySpecificationConfig()
	const causalModel = primarySpecificationConfig.causalModel
	const causalEffects = useCausalEffects(causalModel)
	const alternativeModels = useAlternativeModels(causalModel)
	const specificationData = useLoadSpecificationData()
	const specificationCurveConfig = useSpecificationCurveConfig()
	const defaultDataset = useDefaultDatasetResult()
	const defaultRun = useDefaultRun()
	const run = useRunSignificanceTest(defaultRun?.id)
	const { failedRefutationIds } = useSpecificationCurve()
	const [isCanceled, setIsCanceled] = useState<boolean>(false)
	const significanceTestResult = useActualSignificanceTest()
	const refutationOptions = useRefutationOptions()
	const estimators = useEstimators()

	const { setDone, setTodo } = useAutomaticWorkflowStatus()

	useEffect(() => {
		!isStatus(significanceTestResult?.status, NodeResponseStatus.Completed)
			? setTodo()
			: setDone()
	}, [significanceTestResult, setDone, setTodo])

	const activeValues = useMemo<number[]>(() => {
		return specificationData
			.filter(
				x =>
					!specificationCurveConfig?.inactiveSpecifications?.includes(x.id) &&
					!failedRefutationIds.includes(x.id),
			)
			.map(x => x.estimatedEffect)
	}, [specificationData, specificationCurveConfig, failedRefutationIds])

	const activeTaskIds = useMemo((): string[] => {
		return specificationData
			.filter(
				x =>
					!specificationCurveConfig?.inactiveSpecifications?.includes(x.id) &&
					!failedRefutationIds.includes(x.id),
			)
			.map(x => x.taskId)
	}, [specificationData, specificationCurveConfig, failedRefutationIds])

	const cancelRun = useCallback(() => {
		setIsCanceled(true)
		run().cancel()
	}, [run, setIsCanceled])

	const runSignificance = useCallback(() => {
		const nodes = buildSignificanceTestsNode(activeTaskIds)
		run().execute(nodes, OrchestratorType.ConfidenceInterval)
	}, [run, activeTaskIds])

	const significanceFailed = useMemo((): boolean => {
		return (
			significanceTestResult?.status?.toLowerCase() ===
			NodeResponseStatus.Failed
		)
	}, [significanceTestResult])

	return {
		alternativeModels,
		defaultRun,
		causalEffects,
		specificationData,
		defaultDataset,
		defineQuestion,
		activeValues,
		significanceTestResult,
		significanceFailed,
		isCanceled,
		runSignificance,
		cancelRun,
		refutationOptions,
		estimators,
	}
}