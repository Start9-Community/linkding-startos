import { sdk } from '../sdk'
import { resetOwnerPassword } from './resetOwnerPassword'

export const actions = sdk.Actions.of().addAction(resetOwnerPassword)
