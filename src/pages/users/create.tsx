import { Box, Flex, Heading, Divider, VStack, SimpleGrid, HStack, Button } from '@chakra-ui/react';
import { useMutation } from 'react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"

import Link from 'next/link';
import { Header } from '../../components/Header';
import { SideBar } from '../../components/Sidebar';
import { Input } from '../../components/Form/Input';
import { api } from '../../services/api';
import { queryClient } from '../../services/queryClient';
import { useRouter } from 'next/router';



type CreateFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const CreateUserFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().required('Senha obrigátoria').min(6, 'No minimo 6 caracteres'),
  password_confirmation: yup.string().oneOf([
    null, yup.ref('password')
  ], 'As senha precisam ser iguais'),
})



export default function CreateUser() {
  const router = useRouter()

  const createUser = useMutation(async (user: CreateFormData) => {
    const response = await api.post('users', {
      user: {
        ...user,
        created_at: new Date(),
      }
    })
    return response.data.user;

  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
    }
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(CreateUserFormSchema)
  })

  const { errors } = formState;

  const handleCreateUser: SubmitHandler<CreateFormData> = async (values) => {
    await createUser.mutateAsync(values);
    router.push('/users');
  }

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />
        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
          onSubmit={handleSubmit(handleCreateUser)}
        >
          <Heading size="lg" fontWeight="normal">Criar usuário</Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input name="name" label="Nome Completo" {...register("name")} error={errors.name}></Input>
              <Input name="email" type="email" label="E-mail" {...register("email")} error={errors.email}></Input>
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input name="password" type="password" label="Senha" {...register("password")} error={errors.password}></Input>
              <Input name="password_confirmation" type="password" label="Confirmação da senha"  {...register("password_confirmation")} error={errors.password_confirmation}></Input>
            </SimpleGrid>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/users" passHref>
                <Button as="a" colorScheme="whiteAlpha">Cancelar</Button>
              </Link>
              <Button type="submit" colorScheme="pink" isLoading={formState.isSubmitting}>Salvar</Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}