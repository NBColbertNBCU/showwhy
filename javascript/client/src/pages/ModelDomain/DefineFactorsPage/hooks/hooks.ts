/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler } from '@showwhy/types'
import { useMemo } from 'react'

import { useGoToPage, usePageType } from '~hooks'
import { Pages } from '~types'

import { useSetDonePage } from './useSetPageDone'

export function useBusinessLogic(): {
	pageName: string
	goToConsiderCausalFactors: Handler
} {
	const { pageName } = usePageComponents()
	const goToConsiderCausalFactors = useGoToConsiderCausalFactors()
	useSetDonePage()

	return {
		pageName,
		goToConsiderCausalFactors,
	}
}

function usePageComponents(): {
	pageName: string
} {
	const pageType = usePageType()

	const pageName: string = useMemo(() => {
		const pop = pageType.split('-')
		return pop.join(' ')
	}, [pageType])

	return { pageName }
}

function useGoToConsiderCausalFactors(): Handler {
	return useGoToPage(Pages.ConsiderCausalFactors, Pages.ConsiderCausalFactors)
}