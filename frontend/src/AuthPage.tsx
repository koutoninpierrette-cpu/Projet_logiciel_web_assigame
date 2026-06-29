import { useState, type FormEvent } from 'react'
import { Icon } from './icons'
import { login, signup, ApiError, type ApiUtilisateur } from './api'

function AuthPage({ onClose, onAuthenticated }: { onClose: () => void; onAuthenticated: (user: ApiUtilisateur) => void }) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('signup')
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  const [signupFirstName, setSignupFirstName] = useState('')
  const [signupLastName, setSignupLastName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPseudo, setSignupPseudo] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupError, setSignupError] = useState('')
  const [signupLoading, setSignupLoading] = useState(false)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  function goToForgot() {
    setForgotSent(false)
    setMode('forgot')
  }

  function handleForgotSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!forgotEmail.trim()) return
    setForgotSent(true)
  }

  async function handleSignupSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSignupError('')
    setSignupLoading(true)
    try {
      const user = await signup({
        Nom: signupLastName.trim(),
        Prenom: signupFirstName.trim(),
        Email: signupEmail.trim(),
        Motdepasse: signupPassword,
        Login: signupPseudo.trim(),
      })
      onAuthenticated(user)
    } catch (error) {
      setSignupError(error instanceof ApiError ? error.message : 'Impossible de créer le compte. Réessayez plus tard.')
    } finally {
      setSignupLoading(false)
    }
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      const user = await login({ email: loginEmail.trim(), motdepasse: loginPassword })
      onAuthenticated(user)
    } catch (error) {
      setLoginError(error instanceof ApiError ? error.message : 'Impossible de se connecter. Réessayez plus tard.')
    } finally {
      setLoginLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="icon-btn auth-close" type="button" aria-label="Fermer" onClick={onClose}>
          <Icon name="icon-close" />
        </button>

        <div className="auth-side">
          <a href="#top" className="brand" onClick={onClose}>
            <span className="brand-mark">
              <img
           src="../img.jpg" alt="ASSIGAME" className="brand-logo"/>
            </span>
            <span className="brand-name">ASSIGAME</span>
          </a>
          <h2>Rejoignez la communauté ASSIGAME</h2>
          <p>
           Suivez vos commandes, sauvegardez vos favoris et profitez d'offres réservées aux membres sur l'ensemble de notre catalogue.
          </p>
          <ul className="auth-perks">
            <li>
              <Icon name="icon-check" />
             Sachez où est votre commande, à tout moment
            </li>
            <li>
              <Icon name="icon-check" />
              Codes promo exclusifs
            </li>
            <li>
              <Icon name="icon-check" />
              Liste de favoris synchronisée
            </li>
          </ul>
        </div>

        <div className="auth-form-wrap">
          {mode === 'forgot' ? (
            <button type="button" className="auth-back" onClick={() => setMode('login')}>
              <Icon name="icon-arrow-right" className="auth-back-icon" />
              Retour à la connexion
            </button>
          ) : (
            <div className="auth-tabs" role="tablist">
              <button
                role="tab"
                type="button"
                className={mode === 'signup' ? 'active' : ''}
                aria-selected={mode === 'signup'}
                onClick={() => setMode('signup')}
              >
                Créer un compte
              </button>
              <button
                role="tab"
                type="button"
                className={mode === 'login' ? 'active' : ''}
                aria-selected={mode === 'login'}
                onClick={() => setMode('login')}
              >
                Se connecter
              </button>
            </div>
          )}

          {mode === 'forgot' ? (
            forgotSent ? (
              <div className="auth-success">
                <span className="auth-success-icon">
                  <Icon name="icon-check" />
                </span>
                <h1>Vérifiez vos e-mails</h1>
                <p className="auth-subtitle">
                  Si un compte existe pour <strong>{forgotEmail}</strong>, un lien de
                  réinitialisation vient de lui être envoyé.
                </p>
                <button type="button" className="btn btn-primary auth-submit" onClick={() => setMode('login')}>
                  Retour à la connexion
                </button>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleForgotSubmit}>
                <h1>Mot de passe oublié</h1>
                <p className="auth-subtitle">
                  Indiquez votre adresse e-mail, nous vous envoyons un lien pour
                  réinitialiser votre mot de passe.
                </p>

                <div className="field">
                  <label htmlFor="forgot-email">Adresse e-mail</label>
                  <div className="input-group">
                    <Icon name="icon-mail" />
                    <input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      placeholder="vous@exemple.com"
                      value={forgotEmail}
                      onChange={(event) => setForgotEmail(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <button className="btn btn-primary auth-submit" type="submit">
                  Envoyer le lien
                  <Icon name="icon-arrow-right" />
                </button>
              </form>
            )
          ) : mode === 'signup' ? (
            <form className="auth-form" onSubmit={handleSignupSubmit}>
              <h1>Créer un compte</h1>
              <p className="auth-subtitle">Quelques infos pour commencer.</p>

              {signupError && <p className="auth-error">{signupError}</p>}

              <div className="field-row">
                <div className="field">
                  <label htmlFor="signup-firstname">Prénom</label>
                  <input
                    id="signup-firstname"
                    type="text"
                    autoComplete="given-name"
                    value={signupFirstName}
                    onChange={(event) => setSignupFirstName(event.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="signup-lastname">Nom</label>
                  <input
                    id="signup-lastname"
                    type="text"
                    autoComplete="family-name"
                    value={signupLastName}
                    onChange={(event) => setSignupLastName(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="signup-email">Adresse e-mail</label>
                <div className="input-group">
                  <Icon name="icon-mail" />
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    placeholder="vous@exemple.com"
                    value={signupEmail}
                    onChange={(event) => setSignupEmail(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="signup-pseudo">Pseudo</label>
                <input
                  id="signup-pseudo"
                  type="text"
                  autoComplete="username"
                  maxLength={30}
                  value={signupPseudo}
                  onChange={(event) => setSignupPseudo(event.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="signup-password">Mot de passe</label>
                <input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={signupPassword}
                  onChange={(event) => setSignupPassword(event.target.value)}
                  required
                />
              </div>

              <label className="checkbox">
                <input type="checkbox" required />
                J&apos;accepte les <a href="#top">conditions d&apos;utilisation</a>
              </label>

              <button className="btn btn-primary auth-submit" type="submit" disabled={signupLoading}>
                {signupLoading ? 'Création...' : 'Créer mon compte'}
                <Icon name="icon-arrow-right" />
              </button>

              <p className="auth-switch">
                Vous avez déjà un compte ?{' '}
                <button type="button" onClick={() => setMode('login')}>
                  Connectez-vous
                </button>
              </p>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <h1>Bon retour</h1>
              <p className="auth-subtitle">Connectez-vous pour accéder à votre compte.</p>

              {loginError && <p className="auth-error">{loginError}</p>}

              <div className="field">
                <label htmlFor="login-email">Adresse e-mail</label>
                <div className="input-group">
                  <Icon name="icon-mail" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="vous@exemple.com"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="login-password">Mot de passe</label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  required
                />
              </div>

              <div className="auth-row">
                <label className="checkbox">
                  <input type="checkbox" />
                  Se souvenir de moi
                </label>
                <button type="button" className="link-button" onClick={goToForgot}>
                  Mot de passe oublié ?
                </button>
              </div>

              <button className="btn btn-primary auth-submit" type="submit" disabled={loginLoading}>
                {loginLoading ? 'Connexion...' : 'Se connecter'}
                <Icon name="icon-arrow-right" />
              </button>

              <p className="auth-switch">
                Pas encore de compte ?{' '}
                <button type="button" onClick={() => setMode('signup')}>
                  Inscrivez-vous
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage
