'use client'

import {
    AuthProvider,
    AuthResponse,
    SignInPage,
    SupportedAuthProvider,
} from '@toolpad/core'
import { useSearchParams } from 'next/navigation'
import {
    BaseIngredientsCheckbox,
    CustomEmailLoginField,
    CustomLoginField,
    CustomPasswordField,
    CustomRepeatPasswordField,
    CustomSubmitButton,
    ForgotPasswordLink,
    RememberMeCheckbox,
    SignInLink,
    SignUpLink,
} from '@/app/(auth)/Fields'

const loginProviders = [{ id: 'credentials', name: 'Email and Password' }]

const LoginRegister = ({
    authAction,
    actionHandler,
    providers = loginProviders,
    pending = false,
}: {
    pending?: boolean
    providers?: { id: SupportedAuthProvider; name: string }[]
    authAction: 'login' | 'register' | 'requestPasswordChange' | 'changePassword'
    actionHandler: (provider: AuthProvider, formData: FormData) => Promise<AuthResponse>
}) => {
    const reason = useSearchParams().get('reason')

    switch (authAction) {
        case 'register':
            return (
                <SignInPage
                    signIn={actionHandler}
                    providers={providers}
                    slots={{
                        signUpLink: SignInLink,
                        emailField: CustomEmailLoginField,
                        passwordField: CustomPasswordField,
                        rememberMe: BaseIngredientsCheckbox,
                    }}
                    slotProps={{ form: { noValidate: true } }}
                    localeText={{
                        signInTitle: 'Zarejestruj się',
                        signInSubtitle: 'Podaj wymagane dane, aby założyć konto',
                    }}
                />
            )

        case 'changePassword':
            return (
                <SignInPage
                    signIn={actionHandler}
                    providers={providers}
                    slots={{
                        emailField: CustomPasswordField,
                        passwordField: CustomRepeatPasswordField,
                        rememberMe: () => <></>,
                    }}
                    slotProps={{ form: { noValidate: true } }}
                    localeText={{
                        signInTitle: 'Zmień hasło',
                        signInSubtitle: 'Podaj nowe hasło',
                    }}
                />
            )

        case 'requestPasswordChange':
            return (
                <SignInPage
                    signIn={actionHandler}
                    providers={providers}
                    slots={{
                        emailField: CustomLoginField,
                        submitButton: () => <CustomSubmitButton loading={pending} />,
                    }}
                    slotProps={{ form: { noValidate: true } }}
                    localeText={{
                        signInTitle: 'Zmiana hasła',
                        signInSubtitle:
                            'Jeżeli podasz poprawny login, w ciągu kilku minut otrzymasz email z linkiem do zmiany hasła',
                    }}
                />
            )

        default:
            return (
                <SignInPage
                    signIn={actionHandler}
                    providers={providers}
                    slots={{
                        signUpLink: SignUpLink,
                        emailField: CustomLoginField,
                        passwordField: CustomPasswordField,
                        rememberMe: RememberMeCheckbox,
                        forgotPasswordLink: ForgotPasswordLink,
                    }}
                    slotProps={{ form: { noValidate: true } }}
                    localeText={{
                        signInTitle: 'Zaloguj się',
                        signInSubtitle:
                            reason === 'expired'
                                ? 'Sesja wygasła. Zaloguj się ponownie'
                                : reason === 'passwordChanged'
                                  ? 'Hasło zostało zmienione, możesz się teraz zalogować'
                                  : 'Witaj użytkowniku, zaloguj się aby kontynuować',
                    }}
                />
            )
    }
}

export default LoginRegister
