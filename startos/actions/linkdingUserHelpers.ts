import { sdk } from '../sdk'
import { linkdingDataDir } from '../utils'

type ActionEffects = Parameters<typeof sdk.SubContainer.withTemp>[0]
type LinkdingSubcontainer = Parameters<
  Parameters<typeof sdk.SubContainer.withTemp>[4]
>[0]

export const withLinkdingSubcontainer = <T>(
  effects: ActionEffects,
  fn: (sub: LinkdingSubcontainer) => Promise<T>,
) =>
  sdk.SubContainer.withTemp(
    effects,
    { imageId: 'linkding' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: linkdingDataDir,
      readonly: false,
    }),
    'linkding-action-sub',
    fn,
  )

export const ownerHasAdminAccess = (effects: ActionEffects, username: string) =>
  withLinkdingSubcontainer(effects, async (sub) => {
    const { stdout } = await sub.execFail(
      [
        'python',
        '-c',
        `import os, sqlite3
path = os.path.join(os.environ['DATA_DIR'], 'db.sqlite3')
if not os.path.isfile(path):
    print('false')
else:
    db = sqlite3.connect('file:' + path + '?mode=ro', uri=True)
    exists = db.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='auth_user'").fetchone()
    row = db.execute('SELECT is_superuser, is_staff, is_active FROM auth_user WHERE username = ?', (os.environ['OWNER'],)).fetchone() if exists else None
    print('true' if row and all(row) else 'false')`,
      ],
      { env: { DATA_DIR: linkdingDataDir, OWNER: username } },
    )
    return stdout.toString().trim() === 'true'
  })
