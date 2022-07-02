from typing import List

from app.dto.response import MemberDTO
from app.models.team import Member
from app.serializers.team import MemberSerializer


def get_member_report(members) -> List[MemberDTO]:
    serializer = MemberSerializer(members, many=True)
    return [MemberDTO(**m) for m in serializer.data]
