import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { usersApi } from "../../features/users/usersApi";
import type { User, NewUser } from "../../entities";
import { toast } from "../../hooks/use-toast";
import type { UpdateUser } from "../../entities";

const USERS_QK: QueryKey = ["users"];

/* List */
export const useUsers = () =>
  useQuery<User[]>({ queryKey: USERS_QK, queryFn: usersApi.list });

/* Single */
export const useUser = (id: number, enabled = true) =>
  useQuery<User>({
    queryKey: [...USERS_QK, id],
    queryFn : () => usersApi.getById(id),
    enabled,
  });

/* Create */
export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewUser) => usersApi.create(payload),
    onSuccess : () => {
      qc.invalidateQueries({ queryKey: USERS_QK });
      toast({ title: "User created" });
    },
    onError   : () =>
      toast({ title: "Error creating user", variant: "destructive" }),
  });
};

/* Update */
export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUser }) =>
      usersApi.update(id, data),
    onSuccess : (_, { id, data }) => {
      qc.setQueryData<User[]>(USERS_QK, (old) =>
        old?.map((u) => (u.id === id ? { ...u, ...data } : u)),
      );
      qc.setQueryData<User>([...USERS_QK, id], (old) =>
        old ? { ...old, ...data } : old,
      );
      toast({ title: "User updated" });
    },
    onError   : () =>
      toast({ title: "Error updating user", variant: "destructive" }),
    onSettled : () => qc.invalidateQueries({ queryKey: USERS_QK }),
  });
};

/* Delete */
export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usersApi.remove(id),
    onSuccess : (_, id) => {
      qc.setQueryData<User[]>(USERS_QK, (old) => old?.filter((u) => u.id !== id));
      qc.invalidateQueries({ queryKey: [...USERS_QK, id] });
      toast({ title: "User deleted" });
    },
    onError   : () =>
      toast({ title: "Error deleting user", variant: "destructive" }),
  });
};


export const useDoctors = () =>
  useQuery<User[]>({
    queryKey: ["users", "doctors"],
    queryFn: usersApi.getDoctors,
  });

