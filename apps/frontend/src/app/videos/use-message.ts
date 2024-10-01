import { atom, useAtom } from "jotai";
import { Message } from "./schema";

type Config = {
  selected?: Message;
};

const configAtom = atom<Config>({
  selected: undefined,
});

export function useMessage() {
  const [config, setConfig] = useAtom(configAtom);

  const selectMessage = (message: Message) => {
    setConfig({ selected: message });
  };

  const { selected: selectedMessage } = config;

  return { selectedMessage, selectMessage };
}
