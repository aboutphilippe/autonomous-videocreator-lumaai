import { signIn, signOut, auth } from "../auth";

export default async function SignIn() {
  const session = await auth();
  console.log("session", session);
  //@ts-ignore
  const sessionAccessToken = session?.accessToken;

  if (!sessionAccessToken) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button type="submit">Signin with Google</button>
      </form>
    );
  }

  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Signout {session.user?.name}</button>
      </form>
    </div>
  );
}
