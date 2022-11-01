const baseUrl = 'https://jsonplaceholder.typicode.com/posts';

export const postApi = {
  getPosts(page: number, pageSize: number) {
    return fetch(`${baseUrl}?_limit=${pageSize}&_page=${page}`)
        .then((res: Response | any) => {
          return res.json()
        })
  },

  getPostId(id: string): Promise<PostItem_Type> {
    return fetch(`${baseUrl}/${id}`)
        .then((res: Response) => res.json())
  },

  getPostIdComments(id: string): Promise<Comments_Type[]> {
    return fetch(`${baseUrl}/${id}/comments`)
        .then((res: Response) => res.json())
  },

  getPostIdFull(id: string): Promise<[PostItem_Type, Comments_Type[]]> {
    return Promise.all([
      this.getPostId(id),
      this.getPostIdComments(id),
    ])
  }

}

export type PostItem_Type = {
  id: number,
  title: string,
  body: string,
  userId?: number
}

export type Comments_Type = {
  body: string,
  id: number,
  email: string,
  name: string,
  postid: number
}


