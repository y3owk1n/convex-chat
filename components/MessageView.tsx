import { Message } from "@/types/common.types";
import { Box, Text, chakra } from "@chakra-ui/react";
import React, { FC } from "react";

interface MessageViewProps {
  message: Message;
}

const MessageView: FC<MessageViewProps> = ({ message }) => {
  return (
    <Box w="full">
      <Text>
        <chakra.span fontWeight={"bold"}>{message.author}:</chakra.span>{" "}
        {message.body}
      </Text>
    </Box>
  );
};

export default MessageView;
