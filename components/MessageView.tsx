import { useAuth } from "@/lib/auth";
import { Message } from "@/types/common.types";
import { Box, Text, chakra } from "@chakra-ui/react";
import { Id } from "convex-dev/values";
import React, { FC } from "react";

interface MessageViewProps {
  message: Message;
}

const MessageView: FC<MessageViewProps> = ({ message }) => {
  const { userId } = useAuth();

  return (
    <Box w="full">
      <Text>
        <chakra.span fontWeight={"bold"}>
          {message.user.equals(userId as Id) ? "Me" : message.author}:
        </chakra.span>{" "}
        {message.body}
      </Text>
    </Box>
  );
};

export default MessageView;
