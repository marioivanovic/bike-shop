export const validateRegister = (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: ' ❌ Email non valide !! ' })
    }

    if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({ message: ' ❌ Le mot de passe doit contenir au moins : 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial ! ' })
    }

    if (!firstName || !lastName) {
        return res.status(400).json({ message: '❌ Il faut le prénom et le nom obligatoirement !!' })
    }

    next()
};