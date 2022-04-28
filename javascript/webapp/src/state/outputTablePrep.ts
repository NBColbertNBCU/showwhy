/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const outputTablePrepState = atom<ColumnTable | undefined>({
	key: 'output-table-prep',
	default: undefined,
	dangerouslyAllowMutability: true,
})

export function useOutputTablePrep(): ColumnTable | undefined {
	return useRecoilValue(outputTablePrepState)
}

export function useSetOutputTablePrep(): SetterOrUpdater<
	ColumnTable | undefined
> {
	return useSetRecoilState(outputTablePrepState)
}

export function useResetOutputTablePrep(): Resetter {
	return useResetRecoilState(outputTablePrepState)
}