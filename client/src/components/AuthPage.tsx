import { useState, type ChangeEvent, type FormEvent } from "react";


interface FormData {
  nom?: string;
  email: string;
  mdp: string;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({ email: "", mdp: "" });
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const url = isLogin
        ? "http://localhost:5000/api/login"
        : "http://localhost:5000/api/users";
      const body = isLogin
        ? { email: formData.email, mdp: formData.mdp }
        : formData;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Erreur");

      setMessage(data.msg || "Succès !");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
          {isLogin ? "Connexion" : "Inscription"}
        </h2>

        {message && (
          <div className="mb-4 text-center text-sm text-red-500">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom || ""}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              name="mdp"
              value={formData.mdp}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition"
          >
            {isLogin ? "Se connecter" : "S’inscrire"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
            className="text-orange-600 hover:underline text-sm"
          >
            {isLogin ? "Créer un compte" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}
