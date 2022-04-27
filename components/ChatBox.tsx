import { useMutation, useQuery } from "@/convex/_generated";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  IconButton,
  Input,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Id } from "convex-dev/values";
import React, { FC, FormEvent, useState } from "react";
import { BiSend } from "react-icons/bi";
import MessageView from "./MessageView";

interface ChatBoxProps {
  channelId: Id;
}

const ChatBox: FC<ChatBoxProps> = ({ channelId }) => {
  const messages = useQuery("listMessages", channelId);
  const sendMessage = useMutation("sendMessage");
  const toast = useToast();
  const { isAuthenticated } = useAuth0();

  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const [newMessageText, setNewMessageText] = useState("");
  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();
    setIsSendingMessage(true);
    const id = await sendMessage(channelId, newMessageText);
    if (id === "UNAUTHENTICATED") {
      setIsSendingMessage(false);
      toast({
        title: "You must be logged in to send a message",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      setNewMessageText(""); // reset text entry box
      setIsSendingMessage(false);
    }
  }

  return (
    <VStack w="full">
      <Heading w="full" as={"h2"} fontSize="2xl">
        Chats
      </Heading>
      <VStack w="full" textAlign={"left"}>
        {messages ? (
          messages.length ? (
            messages.slice(-10).map((message: any) => (
              <HStack
                bgColor="gray.50"
                p={4}
                w="full"
                rounded="md"
                key={message._id}
                justifyItems="content-between"
              >
                <MessageView message={message} />
                <Text fontSize={"xs"} color="gray.500">
                  {new Date(message.time).toLocaleTimeString()}
                </Text>
              </HStack>
            ))
          ) : (
            <Text w="full">No Messages yet...</Text>
          )
        ) : (
          <Text w="full">Loading...</Text>
        )}
      </VStack>

      {isAuthenticated && (
        <HStack as="form" onSubmit={handleSendMessage} w="full">
          <Input
            value={newMessageText}
            onChange={(event) => setNewMessageText(event.target.value)}
            placeholder="Write a message…"
          />
          <IconButton
            aria-label="submit"
            icon={<BiSend />}
            isLoading={isSendingMessage}
            type="submit"
            disabled={!newMessageText || isSendingMessage}
            colorScheme={"blue"}
          />
        </HStack>
      )}
    </VStack>
  );
};

export default ChatBox;
