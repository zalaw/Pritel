import { useState, useEffect } from "react";
import { Box, Button, FileButton, Flex, Image, NumberInput, Stack, TextInput, Textarea, Title } from "@mantine/core";
import { useForm, TransformedValues } from "@mantine/form";
import { Reward } from "../interfaces";
import { useAuth } from "../contexts/AuthContext";

interface AddRewardProps {
  reward?: Reward;
  handleClose: () => void;
}

const newReward: Reward = {
  image: "",
  title: "",
  description: "",
  points: "",
};

export default function AddReward({ reward, handleClose }: AddRewardProps) {
  const { addReward } = useAuth();

  const [file, setFile] = useState<File | null>(null);

  const form = useForm({
    validateInputOnBlur: true,

    initialValues: reward || newReward,

    validate: {
      title: value => (value.length < 4 ? "Title must have at least 4 letters" : null),
      description: value => (value.length < 10 ? "Description must have at least 10 letters" : null),
      points: value => (value === "" || value < 0 ? "Points must be a positive number" : null),
    },
  });

  const handleChooseImage = (file: File | null) => {
    if (file === null) return;

    setFile(file);
    form.setFieldValue("image", URL.createObjectURL(file));
  };

  const handleSubmit = (values: Reward) => {
    addReward(values, file);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ padding: "1rem" }}>
      <Stack>
        <Title>{reward ? "Edit" : "Add"} reward</Title>

        <Image src={file ? URL.createObjectURL(file) : null} height={160} alt="Reward image" withPlaceholder />

        <FileButton onChange={e => handleChooseImage(e)} accept="image/png,image/jpeg">
          {props => <Button {...props}>{file ? "Choose another image" : "Choose image"}</Button>}
        </FileButton>

        <TextInput
          withAsterisk
          label="Title"
          placeholder="A good title is a good title"
          {...form.getInputProps("title")}
        />

        <Textarea
          withAsterisk
          label="Description"
          placeholder="Something worth spending points on"
          autosize
          minRows={2}
          maxRows={4}
          {...form.getInputProps("description")}
        />

        <NumberInput
          withAsterisk
          label="Points"
          placeholder="How much it is"
          min={0}
          step={10}
          parser={value => value.replace(/\$\s?|(,*)/g, "")}
          formatter={value =>
            !Number.isNaN(parseFloat(value)) ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : ""
          }
          {...form.getInputProps("points")}
        />

        <Flex mt={20} gap={"1rem"}>
          <Button type="submit" w={"100%"}>
            {reward ? "Edit" : "Add"}
          </Button>

          <Button w={"100%"} color="gray" onClick={handleClose}>
            Cancel
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}
