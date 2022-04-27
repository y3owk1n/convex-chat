import { useMutation } from "@/convex/_generated";
import { slugify } from "@/utils/slugify";
import { VStack, Input, Button, useToast } from "@chakra-ui/react";
import { Id } from "convex-dev/values";
import React, {
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useState,
} from "react";

interface Props {
  setChannelId: Dispatch<SetStateAction<Id | null>>;
}

const ChannelForm: FC<Props> = ({ setChannelId }) => {
  const [newChannelName, setNewChannelName] = useState("");
  const [channelAdding, setChannelAdding] = useState(false);

  const addChannel = useMutation("addChannel");

  const toast = useToast();

  const handleAddChannel = async (event: FormEvent) => {
    event.preventDefault();
    setChannelAdding(true);
    const id = await addChannel(slugify(newChannelName));
    if (id === "UNAUTHENTICATED") {
      toast({
        title: "You must be logged in to create a channel",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setChannelAdding(false);
    } else {
      toast({
        title: `Channel #${newChannelName} created`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setChannelId(id);
      setNewChannelName("");
      setChannelAdding(false);
    }
  };

  return (
    <VStack as="form" onSubmit={handleAddChannel} w="full">
      <Input
        value={newChannelName}
        onChange={(event) => setNewChannelName(event.target.value)}
        placeholder="Add a new channel..."
        w="full"
      />
      <Button
        w="full"
        type="submit"
        colorScheme={"blue"}
        disabled={!newChannelName || channelAdding}
        isLoading={channelAdding}
      >
        Add
      </Button>
    </VStack>
  );
};

export default ChannelForm;
