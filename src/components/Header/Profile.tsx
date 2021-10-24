import { Flex, Box, Text, Avatar } from "@chakra-ui/react";


interface ProfileProps {
  showProfileData: boolean;
}

export function Profile({ showProfileData }: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Willian Araujo</Text>
          <Text color="gray.300" fontSize="small">
            willianlins@outlook.com.br
          </Text>
        </Box>
      )}
      <Avatar size="md" name="Willian Araujo" src="https://github.com/willianlins.png" />
    </Flex>
  );
}