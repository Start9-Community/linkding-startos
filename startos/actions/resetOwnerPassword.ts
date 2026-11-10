import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { linkdingWorkDir } from '../utils'
import { withLinkdingSubcontainer } from './linkdingUserHelpers'

export const resetOwnerPassword = sdk.Action.withoutInput(
  'reset-owner-password',
  async ({ effects }) => {
    const { adminUsername, adminConfigured } = (await storeJson
      .read()
      .const(effects)) ?? { adminUsername: 'owner', adminConfigured: false }
    return {
      name: i18n('Set Owner Password'),
      description: i18n('Generate a password for the owner account.'),
      warning: adminConfigured
        ? i18n(
            'This replaces the password for ${username} and restores administrator access, including reactivating a disabled account.',
            { username: adminUsername },
          )
        : null,
      allowedStatuses: 'any',
      group: null,
      visibility: 'enabled',
    }
  },
  async ({ effects }) => {
    const username =
      (await storeJson.read((s) => s.adminUsername).once()) ?? 'owner'
    const password = utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 32 })

    await withLinkdingSubcontainer(effects, async (sub) => {
      await sub.execFail(['python', 'manage.py', 'migrate', '--noinput'], {
        cwd: linkdingWorkDir,
      })
      await sub.execFail(
        [
          'python',
          'manage.py',
          'shell',
          '-c',
          `import os
from django.contrib.auth import get_user_model
user, _ = get_user_model().objects.get_or_create(username=os.environ["OWNER"])
user.is_superuser = True
user.is_staff = True
user.is_active = True
user.set_password(os.environ["PASSWORD"])
user.save()`,
        ],
        { cwd: linkdingWorkDir, env: { OWNER: username, PASSWORD: password } },
      )
    })
    await storeJson.merge(effects, {
      adminUsername: username,
      adminConfigured: true,
    })

    return {
      version: '1',
      title: i18n('Owner Credentials'),
      message: i18n(
        'Save these credentials; the password cannot be displayed again.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: username,
            masked: false,
            copyable: true,
            qr: false,
            launchable: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: password,
            masked: true,
            copyable: true,
            qr: false,
            launchable: false,
          },
        ],
      },
    }
  },
)
