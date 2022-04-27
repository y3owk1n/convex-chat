import ChatBox from "@/components/ChatBox";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import { useMutation, useQuery } from "@/convex/_generated";
import { Channel } from "@/types/common.types";
import { slugify } from "@/utils/slugify";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  Container,
  Divider,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
  useToast,
  Avatar,
} from "@chakra-ui/react";
import { Id } from "convex-dev/values";
import type { NextPage } from "next";
import { FormEvent, useState } from "react";
import { BiTrash } from "react-icons/bi";

const Home: NextPage = () => {
  const channels = useQuery("listChannels");

  const [channelId, setChannelId] = useState<Id | null>(null);

  const { isAuthenticated, user } = useAuth0();

  const toast = useToast();

  const [newChannelName, setNewChannelName] = useState("");

  const addChannel = useMutation("addChannel");

  const removeChannel = useMutation("removeChannel");

  const [channelAdding, setChannelAdding] = useState(false);

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

  const handleRemoveChannel = async (channelId: Id) => {
    const res = await removeChannel(channelId);
    if (res === "UNAUTHENTICATED") {
      toast({
        title: "You must be logged in to remove a channel",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    if (res === "NOT_OWNER") {
      toast({
        title: "You must be the owner of the channel to remove it",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: `Channel deleted`,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    setChannelId(null);
    return;
  };

  return (
    <Container maxW="container.lg" as="main" py={4}>
      <VStack>
        <Heading as="h1">Chat For Fun 😻</Heading>

        <HStack spacing={2}>
          <Text>Welcome!</Text>
          {isAuthenticated ? (
            <HStack>
              <Avatar name={user?.name} src={user?.picture} size="xs" />
              <Text>{user?.name}</Text>
              <LogoutButton />
            </HStack>
          ) : (
            <LoginButton />
          )}
        </HStack>
      </VStack>

      <Grid
        templateColumns={["repeat(1, 1fr)", null, "repeat(6, 1fr)"]}
        gridGap={5}
        mt={4}
        overflowY={"auto"}
      >
        <GridItem colSpan={[1, null, 2]}>
          <VStack>
            <VStack
              w="full"
              bgColor="gray.50"
              p={4}
              rounded="md"
              textAlign="left"
            >
              <Heading w="full" as={"h2"} fontSize="2xl">
                Channels
              </Heading>
              <Divider />
              {channels !== undefined ? (
                channels.length ? (
                  channels.map((channel: Channel) => (
                    <HStack key={channel._id as any} w="full">
                      <Button
                        justifyContent={"left"}
                        w="full"
                        variant="link"
                        key={channel._id as any}
                        fontWeight={
                          channelId === channel._id ? "bold" : "normal"
                        }
                        onClick={() => setChannelId(channel._id)}
                      >
                        #{channel.name}
                      </Button>
                      {isAuthenticated && (
                        <IconButton
                          aria-label="delete-channel"
                          icon={<BiTrash />}
                          onClick={() => handleRemoveChannel(channel._id)}
                        />
                      )}
                    </HStack>
                  ))
                ) : (
                  <Text w="full">No Channels Available</Text>
                )
              ) : (
                <Text w="full">Loading...</Text>
              )}
            </VStack>

            {isAuthenticated && (
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
            )}
          </VStack>
        </GridItem>
        <GridItem colSpan={[1, null, 4]}>
          {channelId ? <ChatBox channelId={channelId} /> : null}
        </GridItem>
      </Grid>
    </Container>
  );
};

export default Home;
