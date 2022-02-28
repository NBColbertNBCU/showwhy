/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StepResource } from './StepResource'
import type { StepStatus } from './StepStatus'

export interface Step {
	id: string
	title: string
	guidance?: string
	getMarkdown?: () => Promise<{ default: string }>
	status: StepStatus
	url: string
	showStatus?: boolean
	resources?: StepResource[]
	subStepName?: string
}