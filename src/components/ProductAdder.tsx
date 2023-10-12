"use client";
import { useState, useRef } from "react";
import {
  Autocomplete,
  Loader,
  Group,
  ActionIcon,
  NumberInput,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";

export function ProductAdder({
  onAdd,
  onRemoveClick
}: {
  onAdd: (value: any, quantity: number) => void;
  onRemoveClick: () => void;
}) {
  const timeoutRef = useRef<number>(-1);
  const [value, setValue] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);

  const handleChange = (val: string) => {
    window.clearTimeout(timeoutRef.current);
    setValue(val);
    setData([]);

    if (val.trim().length === 0 || val.includes("@")) {
      setLoading(false);
    } else {
      setLoading(true);
      timeoutRef.current = window.setTimeout(() => {
        setLoading(false);
        setData(
          ["gmail.com", "outlook.com", "yahoo.com"].map(
            (provider) => `${val}@${provider}`
          )
        );
      }, 1000);
    }
  };
  return (
    <Group align="center">
      <Autocomplete
        value={value}
        data={data}
        onChange={handleChange}
        rightSection={loading ? <Loader size="1rem" /> : null}
        placeholder="Search for items..."
        style={{
          flexGrow: 1,
        }}
      />
      <NumberInput
        placeholder="Quantity"
        value={quantity}
        onChange={(q: number) => setQuantity(q)}
      />
      <ActionIcon
        color="red"
        onClick={onRemoveClick}
      >
        <IconTrash />
      </ActionIcon>
    </Group>
  );
}
