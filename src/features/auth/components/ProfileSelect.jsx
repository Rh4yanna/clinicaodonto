import Select from "../../../components/atoms/Select/Select";

export default function ProfileSelect({
  value,
  onChange,
}) {
  const profiles = [
    {
      value: "aluno",
      label: "Aluno",
    },
    {
      value: "professor",
      label: "Professor",
    },
    {
      value: "recepcao",
      label: "Recepção",
    },
  ];

  return (
    <Select
      options={profiles}
      value={value}
      onChange={onChange}
    />
  );
}