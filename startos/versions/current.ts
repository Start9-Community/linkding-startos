import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { legacyStoreJson, storeJson } from '../fileModels/store.json'
import { ownerHasAdminAccess } from '../actions/linkdingUserHelpers'

export const current = VersionInfo.of({
  version: '1.47.0:0',
  releaseNotes: {
    en_US:
      'Linkding adds bookmark sorting and filtering, REST API CORS support, and protection against server-side request forgery. Set Owner Password shows the owner password once, when it is set; run it again to reset it. Additional users are managed from Linkding’s own Admin page (Settings › Admin). [Full upstream changes](https://github.com/sissbruecker/linkding/compare/v1.45.0...v1.47.0).',
    es_ES:
      'Linkding añade ordenación y filtros de marcadores, compatibilidad con CORS para la API REST y protección contra solicitudes falsificadas del lado del servidor. Set Owner Password muestra la contraseña del propietario una sola vez, al establecerla; vuelve a ejecutarla para restablecerla. Los demás usuarios se gestionan desde la página de administración de Linkding (Ajustes › Admin). [Cambios completos](https://github.com/sissbruecker/linkding/compare/v1.45.0...v1.47.0).',
    de_DE:
      'Linkding ergänzt Sortierung und Filter für Lesezeichen, CORS für die REST-API und Schutz vor serverseitiger Anfragefälschung. Set Owner Password zeigt das Eigentümerpasswort einmal an, wenn es gesetzt wird; zum Zurücksetzen erneut ausführen. Weitere Benutzer werden auf Linkdings eigener Admin-Seite verwaltet (Einstellungen › Admin). [Alle Änderungen](https://github.com/sissbruecker/linkding/compare/v1.45.0...v1.47.0).',
    pl_PL:
      'Linkding dodaje sortowanie i filtrowanie zakładek, obsługę CORS dla API REST oraz ochronę przed fałszowaniem żądań po stronie serwera. Set Owner Password pokazuje hasło właściciela jeden raz, przy jego ustawieniu; uruchom ją ponownie, aby je zresetować. Pozostałymi użytkownikami zarządza się na stronie administracyjnej Linkding (Ustawienia › Admin). [Pełna lista zmian](https://github.com/sissbruecker/linkding/compare/v1.45.0...v1.47.0).',
    fr_FR:
      'Linkding ajoute le tri et le filtrage des favoris, la prise en charge CORS pour l’API REST et une protection contre la falsification des requêtes côté serveur. Set Owner Password affiche le mot de passe propriétaire une seule fois, lorsqu’il est défini ; relancez-la pour le réinitialiser. Les autres utilisateurs se gèrent depuis la page d’administration de Linkding (Paramètres › Admin). [Toutes les modifications](https://github.com/sissbruecker/linkding/compare/v1.45.0...v1.47.0).',
  },
  migrations: {
    up: async ({ effects }) => {
      const legacy = await legacyStoreJson.read().once()
      if (legacy) {
        if (!(await storeJson.read().once())) {
          const adminUsername = legacy.adminUsername ?? 'owner'
          await storeJson.merge(effects, {
            adminUsername,
            adminConfigured:
              !!legacy.adminPassword &&
              (await ownerHasAdminAccess(effects, adminUsername)),
          })
        }
        await legacyStoreJson.merge(effects, { adminPassword: undefined })
      }
    },
    down: IMPOSSIBLE,
  },
})
