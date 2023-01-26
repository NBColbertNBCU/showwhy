/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultValue, selectorFamily } from 'recoil'

import type { NodePosition } from '../../domain/NodePosition.js'
import { NodePositionsState } from '../atoms/index.js'

export const nodePositionsFamily = selectorFamily<NodePosition, string>({
	key: 'nodePositionsFamily',
	get: (id) => ({ get }) => {
		const nodePositions = get(NodePositionsState)
		return nodePositions[id] ?? { x: 0, y: 0 }
	},
	set: (id) => ({ set, get, reset }, nodePosition) => {
		if (!nodePosition) {
			return
		}

		if (nodePosition instanceof DefaultValue) {
			reset(NodePositionsState)
			return
		}

		const nodePositions = get(NodePositionsState)
		const newNodePositions = { ...nodePositions }
		newNodePositions[id] = nodePosition
		set(NodePositionsState, newNodePositions)
	},
})
