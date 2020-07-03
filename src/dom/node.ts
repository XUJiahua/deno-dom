import { getLock, setLock } from "../constructor-lock.ts";
import { NodeList, NodeListMutator, nodeListMutatorSym } from "./node-list.ts";
import { Element } from "./element.ts";

export class EventTarget {
  addEventListener() {
    // TODO
  }

  removeEventListener() {
    // TODO
  }

  dispatchEvent() {
    // TODO
  }
}

export const enum NodeType {
  ELEMENT_NODE = 1,
  ATTRIBUTE_NODE = 2,
  TEXT_NODE = 3,
  CDATA_SECTION_NODE = 4,
  ENTITY_REFERENCE_NODE = 5,
  ENTITY_NODE = 6,
  PROCESSING_INSTRUCTION_NODE = 7,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
  DOCUMENT_TYPE_NODE = 10,
  DOCUMENT_FRAGMENT_NODE = 11,
  NOTATION_NODE = 12,
}

export class Node extends EventTarget {
  public nodeValue: string | null;
  public childNodes: NodeList;
  public parentElement: Element | null;
  #childNodesMutator: NodeListMutator;

  constructor(
    public nodeName: string,
    public nodeType: NodeType,
    public parentNode: Node | null,
  ) {
    super();
    if (getLock()) {
      throw new TypeError("Illegal constructor");
    }

    this.nodeValue = null;
    this.childNodes = new NodeList();
    this.#childNodesMutator = this.childNodes[nodeListMutatorSym]();
    this.parentElement = <Element> parentNode;
  }

  _getChildNodesMutator(): NodeListMutator {
    return this.#childNodesMutator;
  }

  cloneNode() {
    // TODO
  }

  remove() {
    const parent = this.parentNode;

    if (parent) {
      const nodeList = parent._getChildNodesMutator();
      const idx = nodeList.indexOf(this);
      nodeList.splice(idx, 1);
      this.parentNode = this.parentElement = null;
    }
  }

  appendChild(child: Node) {
    if (child.parentNode) {
      child.remove();
    }

    child.parentNode = child.parentElement = <Element> <unknown> this;
    this.#childNodesMutator.push(child);
  }

  removeChild(child: Node) {
    // TODO
  }

  replaceChild(child: Node) {
    // TODO
  }
}

export class CharacterData extends Node {
  constructor(
    public data: string,
    nodeName: string,
    nodeType: NodeType,
    parentNode: Node | null,
  ) {
    super(
      nodeName,
      nodeType,
      parentNode,
    );
    if (getLock()) {
      throw new TypeError("Illegal constructor");
    }

    this.nodeValue = data;
  }

  get length(): number {
    return this.data.length;
  }

  // TODO: Implement NonDocumentTypeChildNode.nextElementSibling, etc
  // ref: https://developer.mozilla.org/en-US/docs/Web/API/CharacterData
}

export class Text extends CharacterData {
  constructor(
    text: string = "",
  ) {
    let oldLock = getLock();
    setLock(false);
    super(
      text, 
      "#text", 
      NodeType.TEXT_NODE, 
      null,
    );
    setLock(oldLock);
  }
}

export class Comment extends CharacterData {
  constructor(
    text: string = "",
  ) {
    let oldLock = getLock();
    setLock(false);
    super(
      text, 
      "#comment", 
      NodeType.COMMENT_NODE, 
      null,
    );
    setLock(oldLock);
  }
}
