"use client";
import { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Loader,
  Group,
  ActionIcon,
  NumberInput,
  InputBase,
  Input,
  Combobox,
  Text,
  useCombobox,
  ScrollArea,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconTrash, IconDeviceFloppy } from "@tabler/icons-react";
import { SEARCH_PRODUCTS_QUERY } from "@/graphql/queries";
import { Product } from "@prisma/client";
import { ADD_PRODUCT_ORDER_MUTATION } from "@/graphql/mutations";

export function ProductAdder({
  orderId,
  initialProduct,
  onAddClick,
  onRemoveClick,
  onProductChange,
}: {
  orderId: string;
  initialProduct: any;
  onAddClick: (product: any, quantity: number) => void;
  onRemoveClick: (product: any, quantity: number) => void;
  onProductChange: () => void;
}) {
  // console.log(initialProduct);
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState(initialProduct.quantity ?? 1);
  const [productQuantity, setProductQuantity] = useState(
    initialProduct.productQuantity ?? 1
  );
  const [product, setProduct] = useState<Product | null>(
    initialProduct ?? null
  );

  const [data, setData] = useState<Product[]>([]);
  const [debouncedSearch] = useDebouncedValue(search, 200);
  const [searchProducts, { loading }] = useLazyQuery(SEARCH_PRODUCTS_QUERY);
  const [addProductToOrder, { loading: addProductLoading }] = useMutation(
    ADD_PRODUCT_ORDER_MUTATION
  );

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      // console.log({ data });
      setSearch("");
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  useEffect(() => {
    searchProducts({
      variables: {
        search: debouncedSearch,
      },
      onCompleted: (data) => {
        setData(data.getProducts);
      },
    });
  }, [searchProducts, debouncedSearch]);

  return (
    <Group align="center">
      <Combobox
        store={combobox}
        withinPortal={true}
        onOptionSubmit={(val, opt) => {
          const { quantity: pQuantity, ...productProps } =
            (opt.children as JSX.Element)!.props;
          setProduct(productProps);
          setProductQuantity(pQuantity);
          combobox.closeDropdown();
        }}
        styles={{
          dropdown: {
            flex: 1,
          },
        }}
      >
        <Combobox.Target>
          <InputBase
            component="button"
            type="button"
            pointer
            rightSection={loading ? <Loader size={18} /> : <Combobox.Chevron />}
            onClick={() => combobox.toggleDropdown()}
            rightSectionPointerEvents="none"
            style={{
              flex: 1,
            }}
            multiline
          >
            {product && product.id ? (
              <SelectOption quantity={productQuantity} name={product.name} />
            ) : (
              <Input.Placeholder>Select Product</Input.Placeholder>
            )}
          </InputBase>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Search
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Search for products"
          />
          <Combobox.Options>
            <ScrollArea h={200} type="scroll">
              {data.length > 0 ? (
                data.map((p) => (
                  <Combobox.Option value={p.id} key={p.id}>
                    <SelectOption {...p} />
                  </Combobox.Option>
                ))
              ) : (
                <Combobox.Empty>Nothing found</Combobox.Empty>
              )}
            </ScrollArea>
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
      <NumberInput
        placeholder="Quantity"
        value={quantity}
        onChange={(q: number) => setQuantity(q)}
      />
      <ActionIcon
        color="green"
        variant="outline"
        loading={addProductLoading}
        loaderProps={{ type: "dots" }}
        onClick={async () => {
          if (!product) return;
          const res = await addProductToOrder({
            variables: {
              id: orderId,
              productId: product.id,
              quantity,
            },
          });
          setProductQuantity(res.data.addProductToOrder.quantity);
          console.log(res.data);
          onAddClick(res.data.addProductToOrder, quantity);
        }}
        // disabled={!!product?.id}
      >
        <IconDeviceFloppy />
      </ActionIcon>
      <ActionIcon
        color="red"
        onClick={() => onRemoveClick(product, quantity)}
        // disabled={!product?.id}
      >
        <IconTrash />
      </ActionIcon>
    </Group>
  );
}
function SelectOption({ quantity, name, description }: Partial<Product>) {
  return (
    <Group wrap="nowrap" px={16}>
      <Text fz={16} style={{ minWidth: "2ch" }}>
        {quantity}
      </Text>
      <div>
        <Text fz="sm">{name}</Text>
        <Text fz="xs" opacity={0.6} lineClamp={1}>
          {description}
        </Text>
      </div>
    </Group>
  );
}
