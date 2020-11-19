
export class Category {

  private id: number;
  private title: string;
  private slug: string;
  private description: string;
  private parentId: number;
  private createdAt?: string;
  private updatedAt?: string;
  private deletedAt?: string;

  constructor(category?) {
    if (category) {
      this.id = category.id;
      this.title = category.title;
      this.slug = category.slug;
      this.description = category.description;
      this.parentId = category.parentId;
      this.createdAt = category.createdAt;
      this.updatedAt = category.updatedAt;
      this.deletedAt = category.deletedAt;
    }
  }

  getId(): number {
    return this.id;
  }

  setId(id: number): void {
    this.id = id;
  }

  getTitle(): string {
    return this.title;
  }

  setTitle(title: string): void {
    this.title = title;
  }

  getSlug(): string {
    return this.slug;
  }

  setSlug(slug: string): void {
    this.slug = slug;
  }

  getDescription(): string {
    return this.description;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  getParentId(): number {
    return this.parentId;
  }

  setParentId(parentId: number): void {
    this.parentId = parentId;
  }

  getCreatedAt(): string {
    return this.createdAt;
  }

  setCreatedAt(createdAt: string): void {
    this.createdAt = createdAt;
  }

  getUpdatedAt(): string {
    return this.updatedAt;
  }

  setUpdatedAt(updatedAt: string): void {
    this.updatedAt = updatedAt;
  }

  getDeleteddAt(): string {
    return this.deletedAt;
  }

  setDeleteddAt(deletedAt: string): void {
    this.deletedAt = deletedAt;
  }
}
