import PropTypes from "prop-types";
import React from "react";
import { Box, Text } from "ink";

const Header = ({ children }: any) => <Text bold={true}>{children}</Text>;

Header.propTypes = {
  children: PropTypes.any.isRequired
};

const Cell = ({ children }: any) => <Text>{children}</Text>;

Cell.propTypes = {
  children: PropTypes.any.isRequired,
  focused: PropTypes.bool
};

Cell.defaultProps = {
  focused: false
};

const Skeleton = ({ children }: any) => <Text>{children}</Text>;

Skeleton.propTypes = {
  children: PropTypes.any.isRequired
};

const get = (key: any) => (obj: any) => obj[key];
const length = (el: any) => el.length;
const isUndefined = (v: any) => v === undefined;
const not = (func: any) => (...args: any[]) => !func(...args);
const toString = (val: any) => (val || String()).toString();
const isEmpty = (el: any) => el.length === 0;
const intersperse = (val: any) => (vals: any) =>
  vals.reduce(
    (s: any, c: any, i: any) => (isEmpty(s) ? [c] : [...s, val(i), c]),
    []
  );

const fillWith = (el: any) => (length: any) => (str: any) =>
  `${str}${el.repeat(length - str.length)}`;

const getCells = (columns: any) => (data: any) =>
  columns.map(({ width, key }: any) => ({ width, key, value: get(key)(data) }));

const union = (...arrs: any[]) => [...new Set([].concat(...arrs))];

const generateColumn = (padding: any) => (data: any) => (key: any) => {
  const allColumns = data.map(get(key));
  const columnsWithValues = allColumns.filter(not(isUndefined));
  const vals = columnsWithValues.map(toString);
  const lengths = vals.map(length);
  const width = Math.max(...lengths, key.length) + padding * 2;
  return { width, key };
};

const copyToObject = (func: any) => (arr: any) =>
  arr.reduce((o: any, k: any) => ({ ...o, [k]: func(k) }), {});
const generateHeadings = (keys: any) => copyToObject((key: any) => key)(keys);
const generateSkeleton = (keys: any) => copyToObject(() => "")(keys);

const line = (
  key: any,
  Cell: any,
  Skeleton: any,
  { line, left, right, cross, padding }: any
) => (cells: any, index = "") => {
  const fillWithLine = fillWith(line);

  const columns = cells.map(({ width, key, value }: any, i: any) => (
    <Cell key={key + String(i)}>
      {line.repeat(padding)}
      {fillWithLine(width - padding)(toString(value))}
    </Cell>
  ));

  return (
    <Box key={key + String(index)}>
      <Skeleton>{left}</Skeleton>
      {intersperse((i: any) => <Skeleton key={i}>{cross}</Skeleton>)(columns)}
      <Skeleton>{right}</Skeleton>
    </Box>
  );
};

const Table = ({ data, padding, header, cell, skeleton }: any) => {
  const topLine = line("top", skeleton, skeleton, {
    line: "─",
    left: "┌",
    right: "┐",
    cross: "┬",
    padding
  });
  const bottomLine = line("bottom", skeleton, skeleton, {
    line: "─",
    left: "└",
    right: "┘",
    cross: "┴",
    padding
  });
  const midLine = line("mid", skeleton, skeleton, {
    line: "─",
    left: "├",
    right: "┤",
    cross: "┼",
    padding
  });
  const headers = line("header", header, skeleton, {
    line: " ",
    left: "│",
    right: "│",
    cross: "│",
    padding
  });
  const row = line("row", cell, skeleton, {
    line: " ",
    left: "│",
    right: "│",
    cross: "│",
    padding
  });

  const keys = union(...data.map(Object.keys));
  const columns = keys.map(generateColumn(padding)(data));
  const headings = generateHeadings(keys);
  const _skeleton = generateSkeleton(keys);

  const getRow = getCells(columns);
  const headersRow = getRow(headings);
  const emptyRow = getRow(_skeleton);
  const rows = data.map((d: any, i: any) => row(getRow(d), i));

  return (
    <span>
      {topLine(emptyRow)}
      {headers(headersRow)}
      {midLine(emptyRow)}
      {intersperse(() => "")(rows)}
      {bottomLine(emptyRow)}
    </span>
  );
};

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  padding: PropTypes.number,
  header: PropTypes.func,
  cell: PropTypes.func,
  skeleton: PropTypes.func
};

Table.defaultProps = {
  data: [],
  padding: 1,
  header: Header,
  cell: Cell,
  skeleton: Skeleton
};

export { Table, Header, Cell, Skeleton };
