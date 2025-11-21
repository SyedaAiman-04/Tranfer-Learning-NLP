
#include<stdio.h>
#define (x,y) y-x
void main()
{
    int diff,x,y;
    printf("Enter value xand y: ");
    scanf("%d %d",&x,&y);

    diff=(x,y);
    printf("The diff is %d",diff);
}