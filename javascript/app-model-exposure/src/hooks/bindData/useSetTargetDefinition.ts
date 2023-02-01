/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'

import type { Definition } from '../../types/experiments/Definition.js'

export function useSetTargetDefinition(
	saveDefinition: (definition: Definition | Definition) => void,
	definitions: Definition[],
): (selectedDefinitionId: string, column: string) => boolean {
	return useCallback(
		(selectedDefinitionId: string, column: string) => {
			const all: Definition[] = [...definitions]

			const newDefinition = {
				...all?.find((x) => x.id === selectedDefinitionId),
			} as Definition

			if (newDefinition) {
				newDefinition.column =
					newDefinition.column === column ? undefined : column
			}

			saveDefinition(newDefinition)
			return !!newDefinition.column
		},
		[saveDefinition, definitions],
	)
}
